<?php

namespace app\jobs;

use yii\base\BaseObject;
use yii\queue\JobInterface;

/**
 * Разбор файла
 */
class FileParserJob extends BaseObject implements JobInterface
{
    public int $fileId;

    public function execute($queue)
    {

    }

}
