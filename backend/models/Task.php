<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "task".
 *
 * @property int $id
 * @property string $date_start дата и время начала преобразования
 * @property string|null $date_end дата и время конца преобразования
 * @property int $status статус (1 — в работе, 2 — преобразован, 3 — провал)
 *
 * @property File[] $files
 */
class Task extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'task';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['date_start', 'date_end'], 'safe'],
            [['status'], 'required'],
            [['status'], 'default', 'value' => null],
            [['status'], 'integer'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'date_start' => 'дата и время начала преобразования',
            'date_end' => 'дата и время конца преобразования',
            'status' => 'статус (1 — в работе, 2 — преобразован, 3 — провал)',
        ];
    }

    /**
     * Gets query for [[Files]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getFiles()
    {
        return $this->hasMany(File::className(), ['task_id' => 'id']);
    }
}
