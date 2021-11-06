<?php

use yii\db\Migration;

/**
 * Class m211106_090732_update_task
 */
class m211106_090732_update_task extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%task}}', 'onlyFio', $this->boolean()->defaultValue(true)->comment('Только фио'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropColumn('{{%task}}', 'onlyFio');
    }

}
