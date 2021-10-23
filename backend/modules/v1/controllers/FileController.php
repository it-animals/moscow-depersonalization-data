<?php

namespace app\modules\v1\controllers;

use app\jobs\FileParserJob;
use app\models\File;
use app\models\Task;
use app\modules\v1\helpers\BehaviorHelper;
use app\modules\v1\traits\OptionsActionTrait;
use app\services\FileService;
use Yii;
use yii\queue\db\Queue;
use yii\rest\Controller;
use yii\web\NotFoundHttpException;
use yii\web\UploadedFile;
use function array_key_exists;
use function date;
use function is_dir;
use function scandir;

class FileController extends Controller
{
    use OptionsActionTrait;

    private FileService $fileService;

    public function __construct($id, $module, FileService $fileService, $config = [])
    {
        $this->fileService = $fileService;
        parent::__construct($id, $module, $config);
    }

    public function behaviors()
    {
        return BehaviorHelper::api(parent::behaviors(), [
            'POST' => [
                BehaviorHelper::AUTH_NOT_REQUIRED => ['upload'],
            ],
            'GET' => [
                BehaviorHelper::AUTH_NOT_REQUIRED => ['preview', 'image', 'cancel'],
            ],
        ]);
    }

    public function actionCancel(int $id)
    {
        $model = $this->findModel($id);
        /* @var $queue Queue */
        $queue = Yii::$app->queue;
        $queue->remove($model->job_id);
        $model->status = File::STATUS_CANCEL;
        $model->date_end = date('d.m.Y H:i:s');
        $model->save(true, ['status', 'date_end']);
        return [
            'status' => 200,
        ];
    }

    public function actionUpload()
    {
        $files = UploadedFile::getInstancesByName('files');

        $task = new Task();
        $task->date_start = date('d.m.Y H:i:s');
        $task->status = File::STATUS_WORK;
        $task->save();

        foreach ($files as $file) {
            $model = new File();
            $model->name = $file->name;
            $model->date_start = date('d.m.Y H:i:s');
            $model->status = File::STATUS_WORK;
            $model->task_id = $task->id;

            if ($model->save()) {
                $filePath = $this->fileService->getFilePath($model);
                $model->base_path = $filePath;
                $model->save(true, ['base_path']);
                $file->saveAs($filePath);
            }
        }

        foreach ($task->files as $file) {
            /* @var $queue Queue */
            $queue = Yii::$app->queue;
            $jobId = $queue->push(new FileParserJob(['fileId' => $file->id]));
            $file->job_id = $jobId;
            $file->save(true, ['job_id']);
        }

        return [
            'task_id' => $task->id,
        ];
    }

    public function actionImage(int $id, int $page = 0)
    {
        $model = $this->findModel($id);
        $imagePath = $model->image_path;
        if (!$model->image_path) {
            throw new NotFoundHttpException('Файл не сконвертирован.');
        } elseif (is_dir($model->image_path)) {
            $data = scandir($model->image_path);
            if (!array_key_exists($page + 2, $data)) {
                throw new NotFoundHttpException('Файл не найден.');
            }
            $page++;
            $imagePath = $model->image_path . "/{$page}.jpg";
        }
        return Yii::$app->response->sendFile($imagePath, $model->name, ['inline' => true]);
    }

    public function actionPreview(int $id, int $page = 0)
    {
        $model = $this->findModel($id);
        $imagePath = $model->result_path;
        if (!$model->result_path) {
            throw new NotFoundHttpException('Файл не сконвертирован.');
        } elseif (is_dir($model->result_path)) {
            $data = scandir($model->result_path);
            if (!array_key_exists($page + 2, $data)) {
                throw new NotFoundHttpException('Файл не найден.');
            }
            $page++;
            $imagePath = $model->result_path . "/{$page}.jpg";
        }
        return Yii::$app->response->sendFile($imagePath, $model->name, ['inline' => true]);
    }

    protected function findModel($id): File
    {
        if (($model = File::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('Запрашиваемая страница не найдена.');
    }
}