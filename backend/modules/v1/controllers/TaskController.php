<?php

namespace app\modules\v1\controllers;

use app\modules\v1\helpers\BehaviorHelper;
use app\modules\v1\traits\OptionsActionTrait;
use yii\rest\Controller;

class TaskController extends Controller
{
    use OptionsActionTrait;

    public function behaviors()
    {
        return BehaviorHelper::api(parent::behaviors(), [
            'GET' => [
                BehaviorHelper::AUTH_NOT_REQUIRED => ['view'],
            ],
        ]);
    }

    public function actionView(int $id)
    {
        return [
            'id' => $id,
        ];
    }
}