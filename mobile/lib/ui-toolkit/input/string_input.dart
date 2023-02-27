import 'package:flutter/material.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';

import 'package:rich_text_controller/rich_text_controller.dart';

import 'package:mobile/models/Event.dart';
import 'package:mobile/models/field/FieldInput.dart';
import 'package:mobile/models/field/Field.dart';
import 'package:mobile/models/field/Variable.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/bottom-sheets/variable_menu.dart';


class StringInputField extends StatefulWidget {
  final FieldInput editedField;
  final Field templateField;
  final String hint;
  final void Function(bool focus)? onChangedFocus;
  final PlugDetails plug;
  final PlugEvent event;
  final bool isTrigger;

  const StringInputField({super.key,
    required this.hint,
    this.onChangedFocus,
    required this.editedField,
    required this.templateField,
    required this.plug,
    required this.event,
    required this.isTrigger,
  });


  @override
  State<StringInputField> createState() => _StringInputFieldState();
}

class _StringInputFieldState extends State<StringInputField> {
  RichTextController? controller;

  String removeVariable(String value)
  {
    bool foundVar = false;
    for (int i = value.length - 2; i > 0; --i)
    {
      if (value[i] == '}') {
        print("found another inside bracket");
        return value.substring(0, value.length - 1);
      }
      if (value[i] == '{' && i > 0 && value[i - 1] == '\$') {
          foundVar = true;
          break;
      }
    }
    if (!foundVar) {
      return value.substring(0, value.length - 1);
    }
    var reg = RegExp(r'(\${[^}]*})');
    var last = reg.allMatches(value).last.group(0)!;
    print('found $last to remove');
    return value.substring(0, value.length - (last.length));
  }

  void onChange(String value) {
    if (widget.editedField.value.length - 1 == value.length
    && widget.editedField.value.endsWith('}')) {
      value = removeVariable(widget.editedField.value);
      if (value != widget.editedField.value) {
        setState(() {
          controller!.text = value;
          controller!.selection = TextSelection.collapsed(offset: controller!.text.length);
        });
      }
    }
    setState(() {
      widget.editedField.value = value;
    });
  }

  @override
  void initState() {
    controller = RichTextController(
        text: widget.editedField.value,
        onMatch: (List<String> match) {
        },
        patternMatchMap: {
          RegExp(r'\${([^}]*)}'):
          TextStyle(
              color: Colors.orange,
              fontWeight: FontWeight.bold,
              background: Paint()..color = Colors.indigo
          )
        },
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                  (!widget.templateField.required) ? "${widget.templateField.displayName}: " : "${widget.templateField.displayName} (required): ",
                  style: (!widget.templateField.required) ? PlugItStyle.subtitleStyle : PlugItStyle.subtitleStyleWarning
              ),
              (!widget.isTrigger) ? VariableMenu(
                onVariableSelected: (Event event , Variable variable, int idx) {
                  onChange(controller!.text += "\${$idx.${variable.key}}");
                },
                plug: widget.plug,
                event: widget.event,
              ) : const SizedBox(width: 0,),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(5),
            child: Text(widget.templateField.description, style: PlugItStyle.smallStyle),
          ),
          const SizedBox(height: 10,),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Focus(
              onFocusChange: widget.onChangedFocus,
              child: TextFormField(
                maxLines: 20,
                maxLength: 400,
                minLines: 1,
                keyboardType: TextInputType.multiline,
                controller: controller,
                style: PlugItStyle.inputTextStyle,
                onChanged: onChange,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(6),
                  ),
                  hintText: '',
                  hintStyle: PlugItStyle.inputHintStyle
                ),
              ),
            )
          ),
        ]
    );
  }
}
