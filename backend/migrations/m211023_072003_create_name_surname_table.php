<?php

use yii\db\Migration;
use restlin\morphology\MorphologicHelper;

/**
 * Handles the creation of table `{{%name_surname}}`.
 */
class m211023_072003_create_name_surname_table extends Migration
{    
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%name_surname}}', [
            'word' => $this->string(30)->notNull()->comment('слово'),
        ]);
        $this->addPrimaryKey('pk_name_surname', '{{%name_surname}}', 'word');        
        $this->loadNames();
        $this->loadSurnames();        
    }
    
    private function loadNames() {        
        $cases = [MorphologicHelper::GENETIVE, MorphologicHelper::DATIVE, MorphologicHelper::ACCUSATIVE, MorphologicHelper::INSTRUMENTAL, MorphologicHelper::PREPOSITIONAL];
        $i = 0;
        if (($handle = fopen(__DIR__ ."/names.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $sex = $data[1] == 'ж' ? MorphologicHelper::FEMALE : MorphologicHelper::MALE;
                $base = mb_strtolower($data[0], 'UTF-8');
                $base = str_replace('ё', 'е', $base);
                $words = [];
                $words[$base] = true;
                foreach ($cases as $case) {
                    $word = MorphologicHelper::nameCase($base, $sex, $case);
                    $word = mb_strtolower($word, 'UTF-8');
                    $words[$word] = true;
                }
                foreach($words as $word => $result) {
                    $count = $this->db->createCommand('select count(*) from name_surname where word = :word', [":word" => $word])->queryScalar();
                    if(!$count) {
                        $this->insert('name_surname', ['word' => $word]);
                        $i++;
                        echo "Загрузка $i-ого имени\n";
                    }
                }
            }
            fclose($handle);            
        }        
    }
    private function loadSurnames() {
        $cases = [MorphologicHelper::GENETIVE, MorphologicHelper::DATIVE, MorphologicHelper::ACCUSATIVE, MorphologicHelper::INSTRUMENTAL, MorphologicHelper::PREPOSITIONAL];
        $i = 0;
        if (($handle = fopen(__DIR__ ."/surnames.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $base = mb_strtolower($data[0], 'UTF-8');
                $base = str_replace('ё', 'е', $base);        
                $sex = preg_match('/а$/u', $base) ? MorphologicHelper::FEMALE : MorphologicHelper::MALE;
                $words = [];
                $words[$base] = true;
                foreach ($cases as $case) {
                    $word = MorphologicHelper::surnameCase($base, $sex, $case);
                    $word = mb_strtolower($word, 'UTF-8');
                    $words[$word] = true;
                }
                foreach($words as $word => $result) {
                    $count = $this->db->createCommand('select count(*) from name_surname where word = :word', [":word" => $word])->queryScalar();
                    if(!$count) {
                        $this->insert('name_surname', ['word' => $word]);
                        $i++;
                        echo "Загрузка $i-ой фамилии\n";
                    }
                }
            }
            fclose($handle);
        }
    }    

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%name_surname}}');
    }
}
