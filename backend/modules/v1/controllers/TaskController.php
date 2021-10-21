<?php

namespace app\modules\v1\controllers;

use app\models\Task;
use app\modules\v1\helpers\BehaviorHelper;
use app\modules\v1\traits\OptionsActionTrait;
use yii\helpers\ArrayHelper;
use yii\rest\Controller;
use yii\web\NotFoundHttpException;

class TaskController extends Controller
{
    use OptionsActionTrait;

    public function behaviors()
    {
        return BehaviorHelper::api(parent::behaviors(), [
            'GET' => [
                BehaviorHelper::AUTH_NOT_REQUIRED => ['view', 'list'],
            ],
        ]);
    }

    public function actionView(int $id)
    {
        $task = $this->findModel($id);

        $result = ArrayHelper::toArray($task);
        $result['files'] = $task->getFiles()->asArray()->all();

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