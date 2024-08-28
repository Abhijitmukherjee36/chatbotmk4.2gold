<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON input
    $data = json_decode(file_get_contents("php://input"), true);
    $name = trim($data["name"]);
    $phone = trim($data["phone"]);
    $idNumber = trim($data["idNumber"]); // New field
    $date = trim($data["date"]);

    // Validate input
    if (!empty($name) && preg_match('/^[a-zA-Z\s]+$/', $name) &&
        preg_match('/^[0-9]{10}$/', $phone) && !empty($idNumber) && !empty($date)) {
        
        // Database connection
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "chatbotmk4";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO users (name, phone, id_number, visiting_date) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $phone, $idNumber, $date);

        // Execute statement
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Your booking has been saved successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }

        // Close statement and connection
        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid input!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
