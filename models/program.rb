# Program for cell behavior
# 
# Attributes
# ----------------------------------
# name		| string
# lines		| string

require 'csv'

class Program < ActiveRecord::Base
	serialize :lines, Array
end