<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "name_surname".
 *
 * @property string $word слово
 */
class NameSurname extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'name_surname';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['word'], 'required'],
            [['word'], 'string', 'max' => 30],
            [['word'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'word' => 'слово',
        ];
    }
}
