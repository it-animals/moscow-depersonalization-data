<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "address_object".
 *
 * @property string $word слово
 */
class AddressObject extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'address_object';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['word'], 'required'],
            [['word'], 'string', 'max' => 50],
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
