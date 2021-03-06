<?php

use yii\db\Migration;

/**
 * Class m211105_113131_fix_surnames
 */
class m211105_113131_fix_surnames extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->delete('{{%name_surname}}', ['word' => [
            "школа",
            "школой",
            "школу",
            "фонда",
            "фонды",
            "фонде",
            "фонду",
            "жилой",
            "россия",
            "на",
            "фе",
            "ро",
            "вас",
            "московский",
            "российский",

            "аб",
            "ан",
            "аш",
            "бе",
            "ви",
            "ву",
            "ге",
            "го",
            "де",
            "до",
            "дя",
            "ди",
            "дю",
            "ел",
            "ем",
            "из",
            "ин",
            "иш",
            "ки",
            "ке",
            "ку",
            "ле",
            "ло",
            "лю",
            "ма",
            "му",
            "мд",
            "ме",
            "на",
            "ну",
            "ни",
            "ню",
            "ом",
            "оя",
            "пе",
            "ре",
            "ро",
            "те",
            "ус",
            "фе",
            "фу",
            "хе",
            "хо",
            "ху",
            "цэ",
            "эз",
            "эк",
            "эм",
            "юз",
            "юм",
            "юн",
            "юр",
            "юш",

            "дом",
            "доля",
            "закон",
            "закона",
            "закону",
            "законом",
            "законе",
            
            "москва",
            "москвы",
            "москве",
            "москву",
            "москве",
            "москвой",
            
            "российская",
            "российского",
            "российскому",
            "российскым",
            "российске",
            "пол",
            "дата",
            "корпус",
            "серия",
            "россия",
            "россии",
            "россию",
            "россией",
            "россии",
            "ваше",
            "будет",
            "месяц",
            "главный",
            "основной",
            "мой",
            "русский",
            "родной",
            "апрель",
            "фио",
            "настоящий",
            "работников",
            "директор",
            "красного",
            "малый",
        ]]);

        $this->batchInsert('name_surname', ['word'], [
            ["мусульбес"],
            ["мусульбеса"],
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->delete('{{%name_surname}}', ['word' => [
            "мусульбес",
            "мусульбеса",
        ]]);
    }


}
