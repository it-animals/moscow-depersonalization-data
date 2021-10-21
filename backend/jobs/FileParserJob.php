<?php

namespace app\jobs;

use app\models\File;
use yii\base\BaseObject;
use yii\helpers\FileHelper;
use yii\queue\JobInterface;
use function date;
use function in_array;
use function pathinfo;

/**
 * Разбор файла
 */
class FileParserJob extends BaseObject implements JobInterface
{
    public int $fileId;

    private const OFFICE_MIMES = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.oasis.opendocument.text',
    ];

    public function execute($queue)
    {
        $file = File::findOne($this->fileId);
        if (!$file) {
            return false;
        }
        $mime = FileHelper::getMimeType($file->base_path);
        //$pathinfo = pathinfo($file->base_path);

        if (in_array($mime, ['image/jpeg', 'image/png'])) {
            $file->status = File::STATUS_DONE;
            $file->image_path = $file->base_path;
            $file->date_end = date('d.m.Y H:i:s');
            $file->save(true, ['status', 'date_end', 'image_path']);
        } elseif (in_array($mime, self::OFFICE_MIMES)) {
            $file->status = File::STATUS_ERROR;
            $file->date_end = date('d.m.Y H:i:s');
            $file->save(true, ['status', 'date_end']);
        } elseif ($mime == 'application/pdf') {
            $file->status = File::STATUS_ERROR;
            $file->date_end = date('d.m.Y H:i:s');
            $file->save(true, ['status', 'date_end']);
        } else {
            $file->status = File::STATUS_ERROR;
            $file->date_end = date('d.m.Y H:i:s');
            $file->save(true, ['status', 'date_end']);
        }

        return true;
    }

}
