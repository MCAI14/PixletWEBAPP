package PixelConverts;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.swing.*;
import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class FileConverter extends JFrame {
    private JTextField inputField;
    private JTextField outputField;
    private JButton inputButton;
    private JButton outputButton;
    private JButton convertButton;
    private JComboBox<String> formatComboBox;
    private Map<String, String[]> compatibleFormats;

    public FileConverter() {
        super("Pixel Converter");
        initializeCompatibleFormats();
        setupUI();
    }

    private void initializeCompatibleFormats() {
        compatibleFormats = new HashMap<>();
        // Imagens
        compatibleFormats.put("jpg", new String[]{"png", "gif", "bmp", "tiff", "webp"});
        compatibleFormats.put("png", new String[]{"jpg", "gif", "bmp", "tiff", "webp"});
        compatibleFormats.put("gif", new String[]{"png", "jpg", "bmp"});
        // Documentos
        compatibleFormats.put("doc", new String[]{"pdf", "txt", "rtf"});
        compatibleFormats.put("docx", new String[]{"pdf", "txt", "rtf"});
        compatibleFormats.put("pdf", new String[]{"txt", "jpg", "png"});
        // Audio
        compatibleFormats.put("mp3", new String[]{"wav", "ogg", "wma"});
        compatibleFormats.put("wav", new String[]{"mp3", "ogg", "wma"});
    }

    private void setupUI() {
        setLayout(new GridLayout(4, 3, 10, 10));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        inputField = new JTextField(20);
        outputField = new JTextField(20);
        inputButton = new JButton("Select Input File");
        outputButton = new JButton("Select Output Directory");
        convertButton = new JButton("Convert");
        formatComboBox = new JComboBox<>();
        formatComboBox.setEnabled(false);

        // Input row
        add(new JLabel("Input File:"));
        add(inputField);
        add(inputButton);

        // Format selection row
        add(new JLabel("Convert to:"));
        add(formatComboBox);
        add(new JLabel(""));

        // Output row
        add(new JLabel("Output Directory:"));
        add(outputField);
        add(outputButton);

        // Convert button row
        add(new JLabel(""));
        add(convertButton);
        add(new JLabel(""));

        // Add action listeners
        inputButton.addActionListener(e -> selectInputFile());
        outputButton.addActionListener(e -> selectOutputDirectory());
        convertButton.addActionListener(e -> convertFile());
        formatComboBox.addActionListener(e -> updateOutputPath());

        pack();
        setLocationRelativeTo(null);
    }

    private void selectInputFile() {
        JFileChooser fileChooser = new JFileChooser();
        if (fileChooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            inputField.setText(selectedFile.getAbsolutePath());
            updateFormatComboBox(selectedFile);
        }
    }

    private void updateFormatComboBox(File file) {
        String extension = getFileExtension(file);
        formatComboBox.removeAllItems();
        
        if (compatibleFormats.containsKey(extension.toLowerCase())) {
            formatComboBox.setEnabled(true);
            for (String format : compatibleFormats.get(extension.toLowerCase())) {
                formatComboBox.addItem(format);
            }
        } else {
            formatComboBox.setEnabled(false);
            JOptionPane.showMessageDialog(this, 
                "Unsupported file format: " + extension, 
                "Warning", 
                JOptionPane.WARNING_MESSAGE);
        }
    }

    private String getFileExtension(File file) {
        String name = file.getName();
        int lastIndexOf = name.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return "";
        }
        return name.substring(lastIndexOf + 1);
    }

    private void selectOutputDirectory() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            outputField.setText(fileChooser.getSelectedFile().getAbsolutePath());
            updateOutputPath();
        }
    }

    private void updateOutputPath() {
        if (!inputField.getText().isEmpty() && !outputField.getText().isEmpty() && formatComboBox.getSelectedItem() != null) {
            File inputFile = new File(inputField.getText());
            String newFileName = inputFile.getName();
            String oldExtension = getFileExtension(inputFile);
            String newExtension = (String) formatComboBox.getSelectedItem();
            newFileName = newFileName.replace("." + oldExtension, "." + newExtension);
        }
    }

    private void convertFile() {
        try {
            if (formatComboBox.getSelectedItem() == null) {
                JOptionPane.showMessageDialog(this, 
                    "Please select a conversion format", 
                    "Error", 
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            String inputPath = inputField.getText();
            String outputDir = outputField.getText();
            
            if (inputPath.isEmpty() || outputDir.isEmpty()) {
                JOptionPane.showMessageDialog(this, 
                    "Please select input file and output directory", 
                    "Error", 
                    JOptionPane.ERROR_MESSAGE);
                return;
            }

            File inputFile = new File(inputPath);
            String newFileName = inputFile.getName();
            String oldExtension = getFileExtension(inputFile);
            String newExtension = (String) formatComboBox.getSelectedItem();
            newFileName = newFileName.replace("." + oldExtension, "." + newExtension);
            
            File outputFile = new File(outputDir, newFileName);
            
            if (!inputFile.exists()) {
                throw new IOException("Input file does not exist!");
            }
            
            Files.copy(inputFile.toPath(), outputFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            
            JOptionPane.showMessageDialog(this, 
                "File converted successfully!\nFrom: " + inputPath + "\nTo: " + outputFile.getAbsolutePath(), 
                "Success", 
                JOptionPane.INFORMATION_MESSAGE);
            
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, 
                "Error converting file: " + e.getMessage(), 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            FileConverter converter = new FileConverter();
            converter.setVisible(true);
        });
    }
}