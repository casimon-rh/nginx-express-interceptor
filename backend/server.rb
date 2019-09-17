require 'sinatra'

set :bind, '0.0.0.0'

get '/download/:filename' do |filename|
  mime = ''
  ext = filename.rpartition('.').last
  case ext
  when 'jpg'
    mime = 'image/jpeg'
  when 'png'
    mime = 'image/png'
  when 'pdf'
    mime = 'application/pdf'
  else
    mime = 'application/octet-stream'
  end
  send_file "./public/#{filename}", :filename => filename, :type => mime
end