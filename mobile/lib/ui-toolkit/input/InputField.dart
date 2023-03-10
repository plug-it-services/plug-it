import 'package:flutter/material.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';

class InputField extends StatefulWidget {
  final String hint;
  final String? value;
  final bool obscured;
  final Icon? icon;
  final Color? iconColor;
  final void Function(String)? onChanged;
  final void Function(bool focus)? onChangedFocus;
  final TextStyle? hintStyle;
  final TextStyle? valueStyle;
  final String? label;
  final TextStyle? labelStyle;

  const InputField(
      {super.key,
      required this.hint,
      this.obscured = false,
      this.onChanged,
      this.onChangedFocus,
      this.icon,
      this.iconColor,
      this.value,
      this.valueStyle,
      this.label,
      this.labelStyle,
      this.hintStyle});

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
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Focus(
              onFocusChange: widget.onChangedFocus,
              child: TextFormField(
                initialValue: widget.value,
                style: widget.valueStyle ?? PlugItStyle.inputTextStyle,
                onChanged: widget.onChanged,
                obscureText: widget.obscured,
                decoration: InputDecoration(
                    icon: widget.icon,
                    iconColor: widget.iconColor,
                    border: InputBorder.none,
                    hintText: widget.hint,
                    labelText: widget.label,
                    labelStyle: widget.labelStyle,
                    hintStyle: widget.hintStyle ?? PlugItStyle.inputHintStyle),
              ),
            )),
      ),
    );
  }
}
