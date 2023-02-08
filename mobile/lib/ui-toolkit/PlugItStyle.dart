import 'package:flutter/material.dart';

class PlugItStyle {
  static var foregroundColor = Colors.grey[100];
  static const backgroundColor = Colors.white70;

  static var primaryColor = Colors.blue.shade700;
  static var secondaryColor = Colors.grey[300];

  static var buttonColor = Colors.blue.shade700;
  static var buttonColorPressed = Colors.blue.shade300;

  static var validationColor = Colors.green[600];

  static var cardColor = Colors.blue.shade500;


  static const inputHintStyle = TextStyle(fontStyle: FontStyle.italic, fontWeight: FontWeight.normal, color: Colors.black);
  static const inputTextStyle = TextStyle(fontStyle: FontStyle.normal, fontWeight: FontWeight.normal, color: Colors.black);
  static const titleStyle = TextStyle(fontWeight: FontWeight.bold, fontSize: 52);
  static const biggerSubtitleStyle = TextStyle(fontWeight: FontWeight.w500, fontSize: 30);
  static const subtitleStyle = TextStyle(fontWeight: FontWeight.w500, fontSize: 20);
  static const subtitleStyleError = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color:Colors.red);
  static const subtitleStyleWarning = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color: Colors.orange);
  static const subtitleStyleCorrect = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color: Colors.green);
  static const subtitleStyleCorrectLight = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color: Colors.lightGreenAccent);
  static const smallStyle = TextStyle(fontWeight: FontWeight.w300, fontSize: 16);
  static const smallStyleError = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color:Colors.red);
  static const smallStyleWarning = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color: Colors.orange);
  static const smallStyleCorrect = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color: Colors.green);
  static const smallestStyle = TextStyle(fontWeight: FontWeight.w300, fontSize: 11);

}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1).toLowerCase()}";
  }
}