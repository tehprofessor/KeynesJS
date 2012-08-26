require 'rack'

@root = File.expand_path(File.dirname(__FILE__))

map_static_dir = lambda do |name, root|
	map "/#{name}" do
		dir = File.join(root, name)
		run Rack::Directory.new(dir)		
	end
end

map_static_file = lambda do |name, root|
	map "/#{name}" do
		file = File.join(root, name)
		run Rack::File.new(file)		
	end	
end

map_static_dir["docs", @root]
map_static_dir["mvc", @root]
map_static_dir["test", @root]
map_static_dir["utils", @root]
map_static_dir["vendor", @root]
map_static_dir["demo", @root]


map_static_file["tests.html", @root]
map_static_file["keynes.js", @root]
map_static_file["demo.html", @root]