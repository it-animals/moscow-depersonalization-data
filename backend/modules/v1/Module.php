<?php

namespace app\modules\v1;

use Yii;
use yii\base\Module as BaseModule;

/**
 * v1 module definition class
 */
class Module extends BaseModule
{
    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\modules\v1\controllers';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        Yii::$app->errorHandler->errorAction = 'v1/default/error';
        Yii::$app->user->logout();
        Yii::$app->session->destroy();
        // custom initialization code goes here
    }
}
