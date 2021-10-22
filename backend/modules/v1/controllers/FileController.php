<?php

namespace app\modules\v1\controllers;

use app\jobs\FileParserJob;
use app\models\File;
use app\models\Task;
use app\modules\v1\helpers\BehaviorHelper;
use app\modules\v1\traits\OptionsActionTrait;
use app\services\FileService;
use Yii;
use yii\rest\Controller;
use yii\web\NotFoundHttpException;
use yii\web\UploadedFile;
use function date;

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
                BehaviorHelper::AUTH_NOT_REQUIRED => ['preview'],
            ],
        ]);
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
            Yii::$app->queue->push(new FileParserJob(['fileId' => $file->id]));
        }

        return [
            'task_id' => $task->id,
        ];
    }

    public function actionPreview(int $id, int $page = 0)
    {
        $model = $this->findModel($id);
        if (!$model->image_path) {
            throw new NotFoundHttpException('Файл не сконвертирован.');
        }
        return Yii::$app->response->sendFile($model->image_path, $model->name, ['inline' => true]);
    }

    protected function findModel($id): File
    {
        if (($model = File::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('Запрашиваемая страница не найдена.');
    }
}