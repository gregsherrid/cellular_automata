class CreateProgram < ActiveRecord::Migration
  def change
	create_table :programs do |t|
		t.string :name
		t.text :lines

		t.timestamps
	end
  end
end
