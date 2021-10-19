<?php

declare(strict_types=1);

namespace app\modules\v1\helpers;

use yii\filters\AccessControl;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\filters\VerbFilter;
use yii\web\Response;
use function array_key_exists;

final class BehaviorHelper
{
    public const AUTH_REQUIRED = 101;
    public const AUTH_NOT_REQUIRED = 102;

    public static function api(array $behaviors, array $actionRules = []): array
    {
        $verbs = [];
        $actionNames = [];
        $authActionNames = [];

        $actionNames[] = 'options';
        foreach ($actionRules as $rule => $actions) {
            if (array_key_exists(self::AUTH_NOT_REQUIRED, $actions)) {
                foreach ($actions[self::AUTH_NOT_REQUIRED] as $action) {
                    $verbs[$action] = [$rule, 'OPTIONS'];
                    $actionNames[] = $action;
                }
            } elseif (array_key_exists(self::AUTH_REQUIRED, $actions)) {
                foreach ($actions[self::AUTH_REQUIRED] as $action) {
                    $verbs[$action] = [$rule, 'OPTIONS'];
                    $authActionNames[] = $action;
                }
            }
        }

        $behaviors['contentNegotiator']['formats']['text/html'] = Response::FORMAT_JSON;
        $behaviors['authenticator'] = [
            'class' => CompositeAuth::class,
            'authMethods' => [
                HttpBearerAuth::class,
            ],
        ];
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => $verbs,
        ];
        $auth = $behaviors['authenticator'];
        unset($behaviors['authenticator']);
        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
                'Access-Control-Request-Headers' => ['*'],
                'Access-Control-Expose-Headers' => ['x-pagination-current-page', 'x-pagination-page-count', 'x-pagination-per-page', 'x-pagination-total-count'],
            ],
        ];
        $behaviors['authenticator'] = $auth;
        $behaviors['authenticator']['optional'] = $actionNames;
        $behaviors['access'] = [
            'class' => AccessControl::class,
            'rules' => [
                [
                    'allow' => true,
                    'actions' => $actionNames,
                ],
                [
                    'allow' => true,
                    'actions' => $authActionNames,
                    'roles' => ['@'],
                ],
            ],
        ];

        return $behaviors;
    }
}
