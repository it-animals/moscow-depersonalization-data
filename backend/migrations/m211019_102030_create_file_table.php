<?php

use yii\db\ColumnSchemaBuilder;
use yii\db\Migration;

/**
 * Handles the creation of table `{{%file}}`.
 */
class m211019_102030_create_file_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%file}}', [
            'id' => $this->primaryKey(),
            'task_id' => $this->integer()->notNull()->comment('FK на задачу преобразования'),
            'name' => $this->string(10000)->notNull()->comment('имя исходного файла'),
            'date_start' => $this->timestampWithTimezone()->notNull()->comment('дата и время начала преобразования'),
            'date_end' => $this->timestampWithTimezone(null, 'NULL')->comment('дата и время конца преобразования'),
            'status' => $this->integer()->notNull()->comment('статус (1 — в работе, 2 — преобразован, 3 — провал)'),
            'base_path' => $this->string(10000)->comment('путь до исходного файла'),
            'result_path' => $this->string(10000)->comment('путь до итогового файла'),
            'image_path' => $this->string(10000)->comment('путь до итогового файла в формате jpg'),
        ]);

        $this->addForeignKey('fk_file__task_id', 'file', 'task_id', 'task', 'id', 'CASCADE', 'CASCADE');
        $this->createIndex('idx_file__task_id', 'file', 'task_id');

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%file}}');
    }

    /**
     * @param int|null $precision
     * @param string $defaultExpression
     * @return ColumnSchemaBuilder
     */
    private function timestampWithTimezone(?int $precision = null, ?string $defaultExpression = 'CURRENT_TIMESTAMP'): ColumnSchemaBuilder
    {
        return $this->db->schema->createColumnSchemaBuilder('TIMESTAMP WITH TIME ZONE', $precision)->defaultExpression($defaultExpression);
    }
}
