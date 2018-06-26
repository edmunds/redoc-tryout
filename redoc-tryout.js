function sendRequest(host, path, method, body, headers, https) {
  param = {
    url: (https ? "https://" : "http://") + host + path,
    type: method
  }
  if(body) {
    param.body = body;
  }
  if(headers) {
    param.headers = headers;
  }

  $target = $('#target')
  $target.empty()
  $('<img>').attr('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Loading_icon_cropped.gif/40px-Loading_icon_cropped.gif').attr('width', '20').attr('height', '20').appendTo($target)

  $.ajax(param).done(function(data) {
    $target.empty()
    console.log("done:", data)
    $('<span><b>Done</b></span>').appendTo($target)
    $('<br>').appendTo($target)
    $('<textarea>').attr('style', 'width:98%').attr('cols', '55').text(JSON.stringify(data)).appendTo($target)
  }).fail((data) => {
    $target.empty()
    console.log("failed:", data)
    $('<span><b>Failed</b></span>').appendTo($target)
    $('<span>').text(data.statusText).appendTo($target)
  })
}

function printRequestForm(swaggerJson, path, method) {
  $('#target').empty()
  var form = $('#requestForm')
  form.empty();
  $("<input type='hidden'>")
    .attr("name", "uri")
    .attr("value", path)
    .appendTo(form)
  $("<input type='hidden'>")
    .attr("name", "method")
    .attr("value", method)
    .appendTo(form)
  $("<p>").appendTo(form)

  swaggerJson["paths"][path][method]['parameters'].map(
    param => {
      var label = param.in == 'query' ? '&' + param.name + '='
                : param.in == 'path' ? '{' + param.name + '}:'
                : param.in == 'header' ? '-H ' + param.name + ':'
                : param.name + ':';
      $("<span>").append("<b>").text(label).appendTo(form)
      $(param.in == 'body' ? "<textarea>": "<input>")
        .attr("name", param.name)
        .attr("in", param.in)
        .attr("placeholder", param.in + ":" + param.name)
        .appendTo(form)
      $("<br>").appendTo(form)
    }
  );
  $('#form').show();
}

function collectDataAndSendRequest() {
  queryParams = $('input[in=query]').toArray().map(input => [input.name, input.value])
  pathParams = $('input[in=path]').toArray().map(input => [input.name, input.value])
  headerParams = $('input[in=header]').toArray().map(input => [input.name, input.value])
  body = $('input[in=body]').toArray().map(input => input.value).pop()
  uri = $('input[name=uri]').toArray().map(input => input.value).pop()
  method = $('input[name=method]').toArray().map(input => input.value).pop()
  formDataParams = $('input[in=formData]').toArray().map(input => [input.name, input.value])

  pathParams.map(param => {
    uri = uri.replace("{" + param[0] + "}", param[1])
  })
  if(queryParams.length > 0) {
    uri += "?" + queryParams.filter(p => p[1] && p[1] != '')
        .map(p => encodeURI(p[0])+ "=" + encodeURI(p[1]))
        .join("&")
  }

  if(!body && formDataParams.length > 0) {
    body = formDataParams.filter(p => p[1] && p[1] != '')
        .map(p => encodeURI(p[0])+ "=" + encodeURI(p[1]))
        .join("&")
  }

  var headers = headerParams.reduce((m,xy) => {m[xy[0]]=xy[1] ; return m;}, {})
  var https = $('#https').prop('checked') ? true : undefined;
  sendRequest(swaggerJson.host + (swaggerJson.basePath ? swaggerJson.basePath : ""), uri, method, body, Object.keys(headers).length != 0 ? headers : undefined, https)
}


$('#sendButton').click(() => {
  collectDataAndSendRequest();
})

var swaggerJson = null;
swaggerUrl = $('redoc').attr('spec-url')
$.ajax({
  url: swaggerUrl
}).done(data => {
  swaggerJson = typeof data == 'string' ? jsyaml.load(data): data
  if(!swaggerJson.host) {
    swaggerJson.host = defaultHost
  }
})

$(document).ready(() => {


  setTimeout(() => {
    $('.http-verb').toArray().map(c =>$(c).parent().append($('<p>')).append($("<div style='border-radius: 5px; background: white; padding: 5px; width:50px; color: black;' class='try-out'>try-out</div>")))
    $('.try-out').click((event) => {
      verbNode = $($(event.target).parent().children()[0])
      var method = verbNode.text().trim();
      var path = verbNode.next('span').text().trim();

      printRequestForm(swaggerJson, path, method);

      $('#form').appendTo(verbNode.parent().next());
    });

  }, typeof redocLoadingWaitTime == 'undefined' ? 8000 : redocLoadingWaitTime);
})
