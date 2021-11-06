<?php

namespace app\models;

/**
 * This is the model class for table "task".
 *
 * @property int $id
 * @property string $date_start дата и время начала преобразования
 * @property string|null $date_end дата и время конца преобразования
 * @property int $status статус (1 — в работе, 2 — преобразован, 3 — провал)
 * @property boolean $onlyFio
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
            [['status', 'onlyFio'], 'required'],
            [['status'], 'default', 'value' => null],
            [['onlyFio'], 'default', 'value' => true],
            [['status'], 'integer'],
            [['onlyFio'], 'boolean'],
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
            'onlyFio' => 'только фио',
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
