<?php
namespace app\parsers;

/**
 * Парсер персональных данных в изображения страницы
 *
 * @author restlin
 */
class ImageParser {
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

    public function __construct(string $imagePath, string $pdfPath, string $resultPath) {
        $this->imagePath = $imagePath;
        $this->pdfPath = $pdfPath;
        $this->resultPath = $resultPath;
    }

    public function parse(): bool {
        $pdns = $this->pdfToPdn($this->pdfPath);
        $this->hidePDnInImage($this->imagePath, $this->resultPath, $pdns);
    }

    private function pdfToPdn(string $pdfPath): array {
        $content = [];
        exec("pdftotext -bbox $pdfPath - | grep word", $content);
        $search = [];
        $result = [];
        foreach($content as $word) {
            preg_match('/\<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.+)\<\/word\>/u', $word, $search);
            $data = [
                'xMin' => $search[1],
                'yMin' => $search[2],
                'xMax' => $search[3],
                'yMax' => $search[4],
                'word' => $search[5]
            ];
            if($this->isPDn($data)) {
                $result[] = $data;
            }
        }
        return $result;
    }
    private function isPDn(array &$data): bool {
        if(preg_match('/[А-ЯЁ]\.[А-ЯЁ]\. {0,5}[А-ЯЁ][а-яё]{2,25}/u', $data['word'])) {
            $data['word'] = 'И.И. Иванов';
            return true;
        }
        if(preg_match('/[А-ЯЁ][а-яё]{2,25} {0,5}[А-ЯЁ]\.[А-ЯЁ]\./u', $data['word'])) {
            $data['word'] = 'Иванов И.И.';
            return true;
        }
        if(preg_match('/[А-ЯЁ][а-яё]{2,10} {0,5}[А-ЯЁ][а-яё]{2,20} {0,5}[А-ЯЁ][а-яё]{2,25}/u', $data['word'])) {
            $data['word'] = 'Иван Иванович Иванов';
            return true;
        }
        if(preg_match('/[А-ЯЁ][а-яё]{2,25} {0,5}[А-ЯЁ][а-яё]{2,10} {0,5}[А-ЯЁ][а-яё]{2,20}/u', $data['word'])) {
            $data['word'] = 'Иванов Иван Иванович';
            return true;
        }
        return false;
    }

    private function hidePDnInImage(string $imagePath, string $resultPath, array $pdns) {
        $img = imagecreatefromjpeg($imagePath);
        $white = imagecolorallocate($img, 255, 255, 255);
        $black = imagecolorallocate($img, 0, 0, 0);
        $font_file = '/usr/share/fonts/truetype/freefont/FreeMono.ttf';
        $k = 1.725;
        foreach($pdns as $pdn) {
            imagefilledrectangle($img, $k * $pdn['xMin'], $k * $pdn['yMin'], $k * $pdn['xMax'], $k * $pdn['yMax'], $white);
            imagefttext($img, 12, 0, $k * $pdn['xMin'], $k * $pdn['yMax'] - 2, $black, $font_file, $pdn['word']);
        }
        imagejpeg($img, $resultPath);
        imagedestroy($img);
    }
}
