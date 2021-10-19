<?php

namespace app\modules\admin\controllers;

use yii\web\Controller;
use yii\web\Response;

/**
 * Default controller for the `admin` module
 */
class DefaultController extends Controller
{
    /**
     * Renders the index view for the module
     */
    public function actionIndex()
    {
        return $this->render('//site/index');
    }
}
