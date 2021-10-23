<?php

namespace app\modules\v1\controllers;

use app\models\File;
use app\models\Task;
use app\modules\v1\helpers\BehaviorHelper;
use app\modules\v1\traits\OptionsActionTrait;
use yii\helpers\ArrayHelper;
use yii\queue\db\Queue;
use yii\rest\Controller;
use yii\web\NotFoundHttpException;
use function count;
use function date;
use function is_dir;
use function scandir;

class TaskController extends Controller
{
    use OptionsActionTrait;

    public function behaviors()
    {
        return BehaviorHelper::api(parent::behaviors(), [
            'GET' => [
                BehaviorHelper::AUTH_NOT_REQUIRED => ['view', 'list', 'cancel'],
            ],
        ]);
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