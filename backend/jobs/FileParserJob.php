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

        $task = $file->task;
        $countOnWork = 0;
        $countOnError = 0;
        foreach ($task->files as $model) {
            if ($model->status === File::STATUS_WORK) {
                $countOnWork++;
            } elseif ($model->status === File::STATUS_ERROR) {
                $countOnError++;
            }
        }
        if ($countOnWork === 0) {
            $task->status = $countOnError ? File::STATUS_ERROR : File::STATUS_DONE;
            $task->date_end = date('d.m.Y H:i:s');
            $task->save(true, ['status', 'date_end']);
        }

        return true;
    }

}
