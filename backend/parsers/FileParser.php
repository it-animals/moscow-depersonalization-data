<?php

namespace app\parsers;
use Yii;
use yii\helpers\FileHelper;
use app\parsers\ImageParser;

/**
 * Парсер персональных данных в pdf
 * $command2 = "export HOME=/tmp && libreoffice --headless --convert-to jpg {$inputFolder}/*.pdf --outdir {$inputFolder}";
 *
 * @author restlin
 */
class FileParser {
    private string $inputPath;
    private string $type;

    public function __construct(string $inputPath) {
        $this->inputPath = $inputPath;
        $this->type = $this->getFileType($inputPath);
    }
    public function parse(): bool {
        $logs = [];
        $tmpFolder = Yii::getAlias("@runtime/tmp".rand(1, 100));
        if(!file_exists($tmpFolder)) {
            mkdir($tmpFolder);
        }
        if($this->type == 'pdf') {
            //@todo pdf без текста
            return $this->parsePdf($this->inputPath);
        } elseif($this->type == 'image') {
            $command = "tesseract -l rus+eng {$this->inputPath} {$tmpFolder}/out pdf";
            exec($command, $logs);
            $pdfPath = $tmpFolder.'/out.pdf';
            $result = $this->parsePdf($pdfPath);
            return $result;
        } elseif($this->type == 'office') {
            $command = "export HOME=/tmp && libreoffice --headless --convert-to pdf {$this->inputPath} --outdir {$tmpFolder}";
            exec($command, $logs);
            $filename = basename($this->inputPath);
            $name = preg_replace('/\..+$/u', '', $filename);
            $pdfPath = $tmpFolder.'/'.$name.'.pdf';
            $result = $this->parsePdf($pdfPath);
            return $result;
        }
        FileHelper::removeDirectory($tmpFolder);
        return false;
    }

    public function parsePdf(string $inputPath): bool {
        $inputFolder = Yii::getAlias("@runtime/input".rand(1, 100));
        if(!file_exists($inputFolder)) {
            mkdir($inputFolder);
        }
        $resultFolder = Yii::getAlias("@runtime/result".rand(1, 100));
        if(!file_exists($resultFolder)) {
            mkdir($resultFolder);
        }
        $imageFolder = Yii::getAlias("@runtime/image".rand(1, 100));
        if(!file_exists($imageFolder)) {
            mkdir($imageFolder);
        }
        $logs = [];
        $command1 = "pdftk {$inputPath} burst output {$inputFolder}/%d.pdf 2>&1";
        exec($command1, $logs);
        foreach (glob("$inputFolder/*.pdf") as $pdfPath) {
            $command2 = "pdfimages -j -f 1 -l 1 $pdfPath $imageFolder/";
            exec($command2, $logs);
            $imgPath = $imageFolder.'/-000.jpg';
            $resultPath = $resultFolder.'/'.str_replace('.pdf', '.jpg', basename($pdfPath));
            $imgParser = new ImageParser($imgPath, $pdfPath, $resultPath);
            $imgParser->parse();
        }
        FileHelper::removeDirectory($imageFolder);
        FileHelper::removeDirectory($inputFolder);
        //FileHelper::removeDirectory($resultFolder);
        echo $resultFolder,"\n";
        return true;
    }

    private function getFileType(string $path): ?string {
        $mime = exec("file --mime $path");
        $name = basename($path);
        $extension = preg_replace('/^.+\./u', '', $name);
        //@todo добавить проверку по mime
        if(in_array($extension, ['odt', 'ods', 'doc', 'docx', 'xls', 'xlsx', 'rtf'])) {
            return 'office';
        } elseif(in_array($extension, ['jpg', 'jpeg', 'png'])) {
            return 'image';
        } elseif($extension == 'pdf') {
            return 'pdf';
        }
        return null;
    }
}
