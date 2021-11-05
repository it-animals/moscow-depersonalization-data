<?php

namespace app\parsers;

use Yii;
use yii\helpers\FileHelper;
use function basename;
use function dirname;
use function exec;
use function file_exists;
use function glob;
use function implode;
use function in_array;
use function mkdir;
use function pathinfo;
use function preg_replace;
use function str_replace;
use function trim;
use function var_dump;

/**
 * Парсер персональных данных в pdf
 * $command2 = "export HOME=/tmp && libreoffice --headless --convert-to jpg {$inputFolder}/*.pdf --outdir {$inputFolder}";
 *
 * @author restlin
 */
class FileParser
{
    private string $inputPath;
    private string $type;
    private bool $pdfWithoutText = false;

    private string $path;

    public function __construct(string $inputPath)
    {
        $this->inputPath = $inputPath;
        $path = dirname($inputPath);
        $this->path = $path;
        FileHelper::createDirectory("{$path}/input");
        FileHelper::createDirectory("{$path}/result");
        FileHelper::createDirectory("{$path}/image");
        FileHelper::createDirectory("{$path}/tmp");

        $this->type = $this->getFileType($inputPath);
    }

    public function parse(): bool
    {
        $logs = [];
        $search = [];
        $tmpFolder = Yii::getAlias("{$this->path}/tmp");
        if (!file_exists($tmpFolder)) {
            mkdir($tmpFolder);
        }

        if ($this->type == 'pdf') {
            $pagesRaw = exec("pdfinfo {$this->inputPath} | grep Pages");
            preg_match('/\d+/i', $pagesRaw, $search);
            $pageCount = $search[0];
            exec("pdftotext '{$this->inputPath}' -", $logs);
            $this->pdfWithoutText = !trim(implode(' ', $logs))  || count($logs) < 5 * $pageCount; //проверка, что в pdf нет, текста
            return $this->parsePdf($this->inputPath);
        } elseif ($this->type == 'image') {
            $command = "tesseract -l rus+eng '{$this->inputPath}' {$tmpFolder}/out pdf";
            exec($command, $logs);
            $pdfPath = $tmpFolder . '/out.pdf';
            $result = $this->parsePdf($pdfPath);
            return $result;
        } elseif ($this->type == 'office') {
            $command = "export HOME=/tmp && libreoffice --headless --convert-to pdf '{$this->inputPath}' --outdir {$tmpFolder}";
            exec($command, $logs);
            $filename = basename($this->inputPath);
            $name = preg_replace('/\..+$/u', '', $filename);
            $pdfPath = $tmpFolder . '/' . $name . '.pdf';
            $result = $this->parsePdf($pdfPath);
            return $result;
        }
        FileHelper::removeDirectory($tmpFolder);
        return false;
    }

    public function parsePdf(string $inputPath): bool
    {
        $inputFolder = Yii::getAlias("{$this->path}/input");
        if (!file_exists($inputFolder)) {
            mkdir($inputFolder);
        }
        $resultFolder = Yii::getAlias("{$this->path}/result");
        if (!file_exists($resultFolder)) {
            mkdir($resultFolder);
        }
        $imageFolder = Yii::getAlias("{$this->path}/image");
        if (!file_exists($imageFolder)) {
            mkdir($imageFolder);
        }
        $logs = [];
        $command1 = "pdftk '{$inputPath}' burst output {$inputFolder}/%d.pdf 2>&1";
        exec($command1, $logs);
        foreach (glob("$inputFolder/*.pdf") as $pdfPath) {
            //$command2 = "pdfimages -j -f 1 -l 1 $pdfPath $imageFolder/";
            $pathinfo = pathinfo($pdfPath);
            $command2 = "convert -density 300 $pdfPath -quality 100 $imageFolder/{$pathinfo['filename']}.jpg";
            exec($command2, $logs);
            //$imgPath = $imageFolder . '/-000.jpg';
            $imgPath = $imageFolder . "/{$pathinfo['filename']}.jpg";
            $resultPath = $resultFolder . '/' . str_replace('.pdf', '.jpg', basename($pdfPath));
            if($this->pdfWithoutText) { //получаем pdf с текстом
                $command3 = "tesseract -l rus+eng '{$imgPath}' {$inputFolder}/out pdf";
                exec($command3, $logs);
                $pdfPath = $inputFolder.'/out.pdf';
            }
            $imgParser = new ImageParser($imgPath, $pdfPath, $resultPath);
            $imgParser->parse();
        }

        $command4 = "convert '{$resultFolder}/*.jpg' '{$this->path}/output.pdf'";
        exec($command4, $logs);

        FileHelper::removeDirectory($inputFolder);

        $tmpFolder = Yii::getAlias("{$this->path}/tmp");
        FileHelper::removeDirectory($tmpFolder);
        //FileHelper::removeDirectory($imageFolder);
        //FileHelper::removeDirectory($resultFolder);
        echo $resultFolder, "\n";
        return true;
    }

    private function getFileType(string $path): ?string
    {
        $mime = exec("file --mime '$path'");
        $name = basename($path);
        $extension = preg_replace('/^.+\./u', '', $name);
        //@todo добавить проверку по mime
        if (in_array($extension, ['odt', 'ods', 'doc', 'docx', 'xls', 'xlsx', 'rtf'])) {
            return 'office';
        } elseif (in_array($extension, ['jpg', 'jpeg', 'png'])) {
            return 'image';
        } elseif ($extension == 'pdf') {
            return 'pdf';
        }
        return null;
    }
}
