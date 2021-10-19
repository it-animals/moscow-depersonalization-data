<?php

use yii\db\ColumnSchemaBuilder;
use yii\db\Migration;

/**
 * Handles the creation of table `{{%task}}`.
 */
class m211019_102028_create_task_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%task}}', [
            'id' => $this->primaryKey(),
            'date_start' => $this->timestampWithTimezone()->notNull()->comment('дата и время начала преобразования'),
            'date_end' => $this->timestampWithTimezone()->comment('дата и время конца преобразования'),
            'status' => $this->integer()->notNull()->comment('статус (1 — в работе, 2 — преобразован, 3 — провал)'),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%task}}');
    }

    /**
     * @param int|null $precision
     * @param string $defaultExpression
     * @return ColumnSchemaBuilder
     */
    private function timestampWithTimezone(?int $precision = null, string $defaultExpression = 'CURRENT_TIMESTAMP'): ColumnSchemaBuilder
    {
        return $this->db->schema->createColumnSchemaBuilder('TIMESTAMP WITH TIME ZONE', $precision)->defaultExpression($defaultExpression);
    }
}
