module GridBuilder
	def cell_grid(n, m)
		rows = []
		m.times do |y|
			cells = []
			n.times do |x|
				cells << "<div class='cell' id='#{x}-#{y}'></div>"
			end
			rows << "<div class='cellRow clearfix'>#{cells.join}</div>"
		end
		"<div id='cellGrid'>#{rows.join}</div>"
	end
end