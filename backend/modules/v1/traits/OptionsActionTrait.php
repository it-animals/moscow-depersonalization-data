<?php

declare(strict_types=1);

namespace app\modules\v1\traits;

use yii\rest\OptionsAction;

trait OptionsActionTrait
{
    public function actions()
    {
        return [
            'options' => [
                'class' => OptionsAction::class,
            ],
        ];
    }
}