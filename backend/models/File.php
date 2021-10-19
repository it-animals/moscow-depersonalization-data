<?php

namespace app\models;

use app\services\FileService;
use Yii;

/**
 * This is the model class for table "file".
 *
 * @property int $id
 * @property int $task_id FK на задачу преобразования
 * @property string $date_start дата и время начала преобразования
 * @property string|null $date_end дата и время конца преобразования
 * @property int $status статус (1 — в работе, 2 — преобразован, 3 — провал)
 * @property string|null $base_path путь до исходного файла
 * @property string|null $result_path путь до итогового файла
 * @property string|null $image_path путь до итогового файла в формате jpg
 *
 * @property Task $task
 */
class File extends \yii\db\ActiveRecord
{
    const STATUS_WORK = 1;
    const STATUS_DONE = 2;
    const STATUS_ERROR = 3;
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'file';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['task_id', 'status'], 'required'],
            [['task_id', 'status'], 'default', 'value' => null],
            [['task_id', 'status'], 'integer'],
            [['date_start', 'date_end'], 'safe'],
            [['base_path', 'result_path', 'image_path'], 'string', 'max' => 10000],
            [['task_id'], 'exist', 'skipOnError' => true, 'targetClass' => Task::className(), 'targetAttribute' => ['task_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'task_id' => 'FK на задачу преобразования',
            'date_start' => 'дата и время начала преобразования',
            'date_end' => 'дата и время конца преобразования',
            'status' => 'статус (1 — в работе, 2 — преобразован, 3 — провал)',
            'base_path' => 'путь до исходного файла',
            'result_path' => 'путь до итогового файла',
            'image_path' => 'путь до итогового файла в формате jpg',
        ];
    }

    public function afterSave($insert, $changedAttributes) {
        parent::afterSave($insert, $changedAttributes);
        // TODO вынести в EventDispatcher
        $container = Yii::$container;
        try {
            $service = $container->get(FileService::class);
            $service->createDir($this);
        } catch (\Exception $exception) {
            Yii::error($exception->getMessage());
        }
    }

    public function afterDelete() {
        parent::afterDelete();
        // TODO вынести в EventDispatcher
        $container = Yii::$container;
        try {
            $service = $container->get(FileService::class);
            $service->deleteFile($this);
        } catch (\Exception $exception) {
            Yii::error($exception->getMessage());
        }
    }

    /**
     * Gets query for [[Task]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getTask()
    {
        return $this->hasOne(Task::className(), ['id' => 'task_id']);
    }

    /**
     * @return string[]
     */
    public static function getStatuses(): array
    {
        return [
            static::STATUS_WORK => 'В работе',
            static::STATUS_DONE => 'Обработка завершена',
            static::STATUS_ERROR => 'Ошибка обработки',
        ];
    }

    /**
     * @return string
     */
    public function getStatusName(): string
    {
        $statuses = static::getStatuses();
        return $statuses[$this->status] ?? 'Неверный статус';
    }

}
