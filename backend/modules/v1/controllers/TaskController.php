<?php

namespace app\modules\v1\controllers;

use app\models\File;
use app\models\Task;
use app\modules\v1\helpers\BehaviorHelper;
use app\modules\v1\traits\OptionsActionTrait;
use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\FileHelper;
use yii\queue\db\Queue;
use yii\rest\Controller;
use yii\web\NotFoundHttpException;
use ZipArchive;
use function count;
use function date;
use function dirname;
use function file_exists;
use function glob;
use function is_dir;
use function pathinfo;
use function scandir;
use function touch;
use function unlink;
use function var_dump;

class TaskController extends Controller
{
    use OptionsActionTrait;

    public function behaviors()
    {
        return BehaviorHelper::api(parent::behaviors(), [
            'GET' => [
                BehaviorHelper::AUTH_NOT_REQUIRED => ['view', 'list', 'cancel', 'download'],
            ],
        ]);
    }

    public function actionDownload(int $id, int $pdf = 1)
    {
        $model = $this->findModel($id);
        $path = Yii::getAlias('@runtime/task/');
        FileHelper::createDirectory($path);
        if (file_exists($path . $id)) {
            unlink($path . $id);
        }
        touch($path . $id);

        $zip = new ZipArchive();
        $zip->open($path . $id, ZipArchive::CREATE);
        foreach ($model->files as $file) {

            if ($pdf == 1) {
                $output = dirname($file->base_path) . "/output.pdf";
                if (file_exists($output)) {
                    $zip->addFile($output, "{$file->name}");
                }
            } else {
                foreach (glob($file->result_path . '/*.jpg') as $item) {
                    $info = pathinfo($item);

                    $zip->addFile($item, "{$file->name}/{$info['basename']}");
                }

            }
        }
        $zip->close();

        return Yii::$app->response->sendFile($path . $id, "task-{$id}.zip", ['inline' => false]);
    }

    public function actionCancel(int $id)
    {
        $model = $this->findModel($id);
        /* @var $queue Queue */
        $queue = Yii::$app->queue;
        foreach ($model->files as $file) {
            $queue->remove($file->job_id);
            $file->status = File::STATUS_CANCEL;
            $file->date_end = date('d.m.Y H:i:s');
            $file->save(true, ['status', 'date_end']);
        }
        $model->status = File::STATUS_CANCEL;
        $model->date_end = date('d.m.Y H:i:s');
        $model->save(true, ['status', 'date_end']);
        return [
            'status' => 200,
        ];
    }

    public function actionView(int $id)
    {
        $task = $this->findModel($id);

        $result = ArrayHelper::toArray($task);
        $files = $task->getFiles()->orderBy('id')->asArray()->all();
        foreach ($files as $key => $file) {
            if (is_dir($file['image_path'])) {
                $previewDir = scandir($file['image_path']);
                $file['image_pages'] = count($previewDir) > 2 ? count($previewDir) - 2 : 0;
            } else {
                $file['image_pages'] = 0;
            }
            $files[$key] = $file;
        }
        $result['files'] = $files;

        return $result;
    }

    public function actionList()
    {
        return Task::find()->asArray()->all();
    }

    protected function findModel($id): Task
    {
        if (($model = Task::findOne($id)) !== null) {
            return $model;
        }
        throw new NotFoundHttpException('Задача не найдена.');
    }
}