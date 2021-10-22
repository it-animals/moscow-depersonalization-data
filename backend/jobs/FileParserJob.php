<?php

namespace app\jobs;

use app\models\File;
use app\parsers\FileParser;
use Exception;
use Yii;
use yii\base\BaseObject;
use yii\queue\JobInterface;
use function date;
use function dirname;

/**
 * Разбор файла
 */
class FileParserJob extends BaseObject implements JobInterface
{
    public int $fileId;

    public function execute($queue)
    {
        $file = File::findOne($this->fileId);
        if (!$file) {
            return false;
        }
        $parser = new FileParser($file->base_path);

        try {
            if ($parser->parse()) {
                $file->status = File::STATUS_DONE;
                $file->image_path = dirname($file->base_path) . "/result";
                $file->date_end = date('d.m.Y H:i:s');
                $file->save();
            } else {
                $file->status = File::STATUS_ERROR;
                $file->date_end = date('d.m.Y H:i:s');
                $file->save();
            }
        } catch (Exception $exception) {
            Yii::error($exception->getMessage());

            $file->status = File::STATUS_ERROR;
            $file->date_end = date('d.m.Y H:i:s');
            $file->save();
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
