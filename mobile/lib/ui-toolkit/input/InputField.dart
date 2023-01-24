import 'package:flutter/material.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';


class InputField extends StatefulWidget {
  final String hint;
  final bool obscured;
  final Icon? icon;
  final Color? iconColor;
  final void Function(String)? onChanged;
  const InputField({super.key, required this.hint, this.obscured = false, this.onChanged, this.icon, this.iconColor});


  @override
  State<InputField> createState() => _InputFieldState();
}

class _InputFieldState extends State<InputField> {
  @override
  Widget build(BuildContext context) {
    return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                    padding: const EdgeInsets.only(left: 20),
                    child: TextField(
                      style: PlugItStyle.inputTextStyle,
                      onChanged: widget.onChanged,
                      obscureText: widget.obscured,
                      decoration: InputDecoration(
                          icon: widget.icon,
                          iconColor: widget.iconColor,
                          border: InputBorder.none,
                          hintText: widget.hint,
                          hintStyle: PlugItStyle.inputHintStyle
                      ),
                    )
                ),
              ),
      );
  }
}
