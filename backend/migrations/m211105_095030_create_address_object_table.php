<?php

use yii\db\Migration;
use restlin\morphology\MorphologicHelper;

/**
 * Handles the creation of table `{{%address_object}}`.
 */
class m211105_095030_create_address_object_table extends Migration
{
    private $words = [];
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {        
        ini_set('memory_limit', '-1');
        $this->createTable('{{%address_object}}', [
            'word' => $this->string(50)->notNull()->comment('слово'),
        ]);
        $this->addPrimaryKey('pk_address_object', '{{%address_object}}', 'word');
        $this->loadCSV(__DIR__ ."/kladr.csv");
        $this->loadCSV(__DIR__ ."/street.csv");
        $rows = [];
        foreach($this->words as $word => $result) {
            $rows[] = [$word];
        }
        $this->batchInsert('address_object', ['word'], $rows);
    }
    private function loadCSV($file) {
        $cases = [MorphologicHelper::GENETIVE, MorphologicHelper::DATIVE, MorphologicHelper::ACCUSATIVE, MorphologicHelper::INSTRUMENTAL, MorphologicHelper::PREPOSITIONAL];
        if (($handle = fopen($file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                $base = mb_strtolower(trim($data[0]), 'UTF-8');
                $base = str_replace('ё', 'е', $base);
                $this->words[$base] = true;
                foreach ($cases as $case) {
                    $word = MorphologicHelper::collocationCase($base, $case);
                    $word = mb_strtolower($word, 'UTF-8');
                    $this->words[$word] = true;
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
        $this->dropTable('{{%address_object}}');
    }
}
