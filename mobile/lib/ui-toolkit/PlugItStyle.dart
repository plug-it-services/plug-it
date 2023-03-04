import 'package:flutter/material.dart';

class PlugItStyle {
  static var foregroundColor = Colors.grey[100];
  static const backgroundColor = Colors.white70;

  static var primaryColor = const Color.fromARGB(250, 39, 87, 201);
  static var secondaryColor = Colors.grey[300];

  static var buttonColor = Colors.blue.shade700;
  static var buttonColorPressed = Colors.blue.shade300;
  
  static var validationColor = Colors.green[600];

  static var cardColor = const Color.fromARGB(250, 39, 87, 201);


  static const inputHintStyle = TextStyle(fontStyle: FontStyle.italic, fontWeight: FontWeight.normal, color: Colors.black);
  static const inputTextStyle = TextStyle(fontStyle: FontStyle.normal, fontWeight: FontWeight.normal, color: Colors.black);
  static const inputTextStyleWhite = TextStyle(fontStyle: FontStyle.normal, fontWeight: FontWeight.normal, color: Colors.white);
  static const titleStyle = TextStyle(fontWeight: FontWeight.bold, fontSize: 52);
  static const biggerSubtitleStyle = TextStyle(fontWeight: FontWeight.w500, fontSize: 30);
  static const subtitleStyle = TextStyle(fontWeight: FontWeight.w500, fontSize: 20, color: Colors.white);
  static const subtitleStyleError = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color:Colors.red);
  static const subtitleStyleWarning = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color: Colors.orange);
  static const subtitleStyleCorrect = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color: Colors.green);
  static const subtitleStyleCorrectLight = TextStyle(fontWeight: FontWeight.w400, fontSize: 18, color: Colors.lightGreenAccent);
  static const smallStyle = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color: Colors.white);
  static const smallStyleError = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color:Colors.red);
  static const smallStyleWarning = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color: Colors.orange);
  static const smallStyleCorrect = TextStyle(fontWeight: FontWeight.w300, fontSize: 16, color: Colors.green);
  static const smallestStyle = TextStyle(fontWeight: FontWeight.w300, fontSize: 11, color: Colors.white);

}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1).toLowerCase()}";
  }
}

extension HexColor on Color {
  /// String is in the format "aabbcc" or "ffaabbcc" with an optional leading "#".
  static Color fromHex(String hexString) {
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  }

  /// Prefixes a hash sign if [leadingHashSign] is set to `true` (default is `true`).
  String toHex({bool leadingHashSign = true}) => '${leadingHashSign ? '#' : ''}'
      '${alpha.toRadixString(16).padLeft(2, '0')}'
      '${red.toRadixString(16).padLeft(2, '0')}'
      '${green.toRadixString(16).padLeft(2, '0')}'
      '${blue.toRadixString(16).padLeft(2, '0')}';
}