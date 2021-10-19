<?php

namespace app\modules\v1\controllers;

use Yii;
use yii\rest\Controller;
use yii\web\Response;

/**
 * Default controller for the `v1` module
 */
class DefaultController extends Controller
{
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['contentNegotiator']['formats']['text/html'] = Response::FORMAT_JSON;
        return $behaviors;
    }

    /**
     * @return Response
     */
    public function actionIndex(): Response
    {
        return $this->asJson(['api' => 'v1']);
    }

    public function actionError(): Response
    {
        $exception = Yii::$app->errorHandler->exception;
        if ($exception !== null) {
            $statusCode = $exception->statusCode;
            $name = $exception->getName();
            $message = $exception->getMessage();

            return $this->asJson([
                'status' => $statusCode,
                'name' => $name,
                'message' => $message
            ]);
        }

        return $this->asJson([
            'status' => Yii::$app->response->statusCode,
        ]);
    }
}
