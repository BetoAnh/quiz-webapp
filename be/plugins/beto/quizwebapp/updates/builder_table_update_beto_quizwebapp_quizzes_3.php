<?php namespace Beto\Quizwebapp\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateBetoQuizwebappQuizzes3 extends Migration
{
    public function up()
    {
        Schema::table('beto_quizwebapp_quizzes', function($table)
        {
            $table->renameColumn('auth_id', 'author_id');
        });
    }
    
    public function down()
    {
        Schema::table('beto_quizwebapp_quizzes', function($table)
        {
            $table->renameColumn('author_id', 'auth_id');
        });
    }
}
