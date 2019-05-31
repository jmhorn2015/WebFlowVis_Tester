
<!DOCTYPE html>
<html lang="en">
<head>
  <title>WebFlowVis Update</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
</head>
<body>

<div class="container">
  <div class="page-header">
    <h1>Update WebFlowVis project from Github</h1>      
  </div>

  <div>
<?php
$output = shell_exec('git pull 2>&1');
echo "<pre>$output</pre>";
?>

   </div>
  <div class="alert alert-success">
  <strong>Success!</strong> Your WebFlowVis folder has been updated successfully.
</div>

  <button type="button" class="btn btn-primary btn-lg" onclick="window.location.href='../WebFlowVis/'">Click here to see results</button>
</div>

</body>
</html>