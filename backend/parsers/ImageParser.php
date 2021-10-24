<?php

namespace app\parsers;

use Yii;
use function array_filter;
use function array_map;
use function array_merge;
use function exec;
use function explode;
use function fclose;
use function fgets;
use function file_exists;
use function fopen;
use function getimagesize;
use function imagecolorallocate;
use function imagecreatefromjpeg;
use function imagedestroy;
use function imagefilledrectangle;
use function imagefttext;
use function imagejpeg;
use function imagerectangle;
use function implode;
use function in_array;
use function key_exists;
use function min;
use function preg_match;
use function preg_match_all;
use function preg_replace;
use function round;
use function str_replace;
use function trim;
use function var_dump;
use app\models\NameSurname;

/**
 * Парсер персональных данных в изображения страницы
 *
 * @author restlin
 */
class ImageParser
{    
    /**
     * исходный файл в формате картинки
     * @var string
     */
    private string $imagePath;
    /**
     * исходный файл в pdf с текстом
     * @var string
     */
    private string $pdfPath;
    /**
     * результирующая картинка с заменой ПДн
     * @var string
     */
    private string $resultPath;
    /**
     * PDI исходного изображения
     * @var float
     */
    private float $dpi;
    

    public function __construct(string $imagePath, string $pdfPath, string $resultPath)
    {
        $this->imagePath = $imagePath;
        $this->pdfPath = $pdfPath;
        $this->resultPath = $resultPath;

        $pdfSize = $this->getPdfSize($pdfPath);
        $pdfWidth = min($pdfSize[0], $pdfSize[1]); //ищем ширину листа в Pdf
        if ($pdfSize[2] == 'pts') {
            $pdfWidth *= 0.0352778; //переводим в см
        }
        $imgSize = getimagesize($this->imagePath);

        $imgWidth = min($imgSize[0], $imgSize[1]); //ищем ширину листа
        $this->dpi = round($imgWidth * 2.54 / $pdfWidth);
    }

    private function getPdfSize($pdfPath): array
    {
        $command = "pdfinfo {$pdfPath} | grep 'Page size'";
        $search = [];
        $result = exec($command);
        preg_match("/([\d.]+) x ([\d.]+) ([^ ]+)/ui", $result, $search);
        if (!$search) {
            var_dump($pdfPath);
            var_dump($result);
            die(1);
        }
        return [$search[1], $search[2], $search[3]];
    }

    /**
     * Парсинг файла
     * @return bool
     */
    public function parse(): bool
    {
        $pdns = $this->findPdns($this->pdfPath);
        $words = $this->findWords($this->pdfPath, $pdns);
        $this->hidePDnInImage($this->imagePath, $this->resultPath, $words);
        return true;
    }

    /**
     * Поиск ПДн в pdf файле
     * @param string $pdfPath путь до pdf файла
     * @return array
     */
    private function findPdns(string $pdfPath): array
    {
        $content = [];
        exec("pdftotext -r {$this->dpi}  $pdfPath -", $content);
        $text = implode(' ', $content);
        return $this->findPdnInRow($text);
    }

    /**
     * Поиск ПДн в строке
     * @param string $row строка 
     * @return array
     */
    private function findPdnInRow(string $row): array {
        $result = [];
        $matches = [];
        //ETOPAHKXCBM eryopaxc - латинские буквы, похожие визуально на кириллицу
        preg_match_all('/(?<!им\.|им\. |имени|имени )[А-ЯЁETOPAHKXCBM][.,] {0,5}[А-ЯЁETOPAHKXCBM][.,] {0,5}[А-ЯЁETOPAHKXCBM][а-яёeryopaxc]{2,25}/u', $row, $matches);
        if($matches) {
            $result = array_merge($result, $matches[0]);
        }
        preg_match_all('/(?<!им\.|им\. |имени|имени )[А-ЯЁETOPAHKXCBM][а-яёeryopaxc]{2,25} {0,5}[А-ЯЁETOPAHKXCBM][,.] {0,5}[А-ЯЁETOPAHKXCBM][.,]/u', $row, $matches);
        if($matches) {
            $result = array_merge($result, $matches[0]);
        }            
        preg_match_all('/(?<!им\.|им\. |имени|имени )[А-ЯЁETOPAHKXCBM][а-яёeryopaxc]{2,25}[ .,]{0,5}[А-ЯЁETOPAHKXCBM][а-яёeryopaxc]{2,25}[ .,]{0,5}[А-ЯЁETOPAHKXCBM][а-яёeryopaxc]{2,25}/u', $row, $matches);        
        if($matches) {
            $result = array_merge($result, $matches[0]);
        }        
        $result = array_filter($result, function($pdn) {
            if(preg_match("/правительств|москв|росси|консультант|труд|отдел|управлени|департамент|заместител|начальник/ui", $pdn)) {
                return false;
            }
            return true;
        });
        return array_map(function($pdn) {
            return str_replace(',', '', $pdn);            
        }, $result);        
    }

    /**
     * Поиск слов, которые необходимы скрыть
     * @param string $pdfPath путь до pdf файла
     * @param array $pdns массив ПДн
     * @return array
     */
    private function findWords(string $pdfPath, array $pdns): array
    {
        $content = [];
        exec("pdftotext -bbox -r {$this->dpi}  $pdfPath - | grep word", $content);
        $search = [];
        $result = [];
        $words = [];
        foreach ($content as $i => $word) {
            preg_match('/\<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.+)\<\/word\>/u', $word, $search);
            $words[] = [
                'xMin' => $search[1],
                'yMin' => $search[2],
                'xMax' => $search[3],
                'yMax' => $search[4],
                'word' => $search[5]
            ];
            $startWithBig = preg_match('/^[А-ЯЁ][а-яё]/u', $words[$i]['word']) ? true : false;
            $base = $this->correctWord($words[$i]['word']);
            $length = mb_strlen($base, 'UTF-8');            
            if ($this->isPDn([$words[$i]['word']], $pdns)) {
                $result[] = $this->unionWords([$words[$i]]);
            } elseif ($i > 1 && $this->isPDn([$words[$i - 1]['word'], $words[$i]['word']], $pdns)) {
                $result[] = $this->unionWords([$words[$i - 1], $words[$i]]);
            } elseif ($i > 2 && $this->isPDn([$words[$i - 2]['word'], $words[$i - 1]['word'], $words[$i]['word']], $pdns)) {
                $result[] = $this->unionWords([$words[$i - 2], $words[$i - 1], $words[$i]]);
            } elseif($length > 3 && $startWithBig && preg_match("/(вич|вича|вичу|вичем|виче|[ео]вна|[ео]вны|[ео]вне|[ео]вну|[ео]вной|[ео]вне)\W{0,}$/u", $base)) { //поиск отчеств по окончаниям
                $result[] = $this->unionWords([$words[$i]]);
            } elseif($length > 1 && $startWithBig && NameSurname::findOne(['word' => $base])) { //поиск имен и фамилий по словарю
                $result[] = $this->unionWords([$words[$i]]);
            }
        }
        return $result;
    }
    /**
     * Замена ошибочных латинских букв на кириллицу
     * @param string $word слово
     * @return string
     */
    private function correctWord(string $word): string {
        $base = mb_strtolower($word, 'UTF-8');
        //etryopahkxcbm заменяем на корректные русские буквы
        return str_replace(
            ['ё', 'e', 't', 'r', 'y', 'o', 'p', 'a', 'h', 'k', 'x', 'c', 'b', 'm',], 
            ['е', 'е', 'т', 'г', 'у', 'о', 'р', 'а', 'н', 'к', 'х', 'с', 'в', 'м',], 
            $base
        );
    }    

    /**
     * Проверка слов, что они составляют ПДн
     * @param array $words слова
     * @param array $pdns массив ПДн
     * @return bool
     */
    private function isPDn(array $words, array $pdns): bool {
        $check = implode(' ', $words);
        //ETOPAHKXCBM eryopaxc - латинские буквы, похожие визуально на кириллицу
        $check = preg_replace('/[^ .а-яёetryopahkxcbm]/ui','',$check);        
        return in_array($check, $pdns);
    }

    /**
     * Объединение нескольких блоков для единой замены
     * @param array $words массив заменяемых слов
     * @return array
     */
    private function unionWords(array $words): array
    {
        $xMin = $words[0]['xMin'];
        $yMin = $words[0]['yMin'];
        $xMax = $words[0]['xMax'];
        $yMax = $words[0]['yMax'];
        foreach ($words as $word) {
            $xMin = $xMin > $word['xMin'] ? $word['xMin'] : $xMin;
            $yMin = $yMin > $word['yMin'] ? $word['yMin'] : $yMin;
            $xMax = $xMax < $word['xMax'] ? $word['xMax'] : $xMax;
            $yMax = $yMax < $word['yMax'] ? $word['yMax'] : $yMax;
        }
        return [
            'xMin' => $xMin,
            'yMin' => $yMin,
            'xMax' => $xMax,
            'yMax' => $yMax,
            'word' => 'ПДн'
        ];
    }

    /**
     * Обработка файла для скрытия ПДн
     * @param string $imagePath входная картинка
     * @param string $resultPath исходящая картинка
     * @param array $pdns массив скрываемых ПДн
     */
    private function hidePDnInImage(string $imagePath, string $resultPath, array $pdns)
    {
        ini_set('memory_limit', '-1');
        $img = imagecreatefromjpeg($imagePath);
        $white = imagecolorallocate($img, 255, 255, 255);
        $black = imagecolorallocate($img, 0, 0, 0);
        $font_file = Yii::getAlias('@app/fonts/FreeMono.ttf');
        foreach ($pdns as $pdn) {
            imagefilledrectangle($img, $pdn['xMin'] - 2, $pdn['yMin'] - 2, $pdn['xMax'] + 2, $pdn['yMax'] + 2, $white);
            imagerectangle($img, $pdn['xMin'] - 2, $pdn['yMin'] - 2, $pdn['xMax'] + 2, $pdn['yMax'] + 2, $black);
            imagefttext($img, ($pdn['yMax'] - $pdn['yMin']) * 0.7, 0, $pdn['xMin'], $pdn['yMax'] - 2, $black, $font_file, $pdn['word']);
        }
        imagejpeg($img, $resultPath);
        imagedestroy($img);
    }
}
