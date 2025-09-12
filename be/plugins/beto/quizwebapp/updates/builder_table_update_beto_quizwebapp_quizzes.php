<?php namespace Beto\Quizwebapp\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateBetoQuizwebappQuizzes extends Migration
{
    public function up()
    {
        Schema::table('beto_quizwebapp_quizzes', function($table)
        {
            $table->string('slug', 255);
            $table->string('title', 255)->nullable(false)->unsigned(false)->default(null)->comment(null)->change();
        });
    }
    
    public function down()
    {
        Schema::table('beto_quizwebapp_quizzes', function($table)
        {
            $table->dropColumn('slug');
            $table->text('title')->nullable(false)->unsigned(false)->default(null)->comment(null)->change();
        });
    }
}
