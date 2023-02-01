import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/field/Field.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/IconButtonSwitch.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/models/Event.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';


class FieldsEditor extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function(bool ) onCardDeploy;
  final Event? selectedEvent;
  final PlugEvent? editedEvent;

  const FieldsEditor({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.selectedEvent,
    required this.editedEvent,
  });

  @override
  State createState() => _StateFieldsEditor();
}
class _StateFieldsEditor extends State<FieldsEditor>{

  List<Widget> getActionFields() {
    List<Widget> fields = [];

    if (!widget.isOpen || widget.selectedEvent == null || widget.editedEvent == null) {
      return fields;
    }
    for (Field field in widget.selectedEvent!.fields) {
      //TODO: get proper input field based on the type of the data
      fields.add(const SizedBox(height:10));
      int idx = widget.selectedEvent!.fields.indexOf(field);
      fields.add(
          Row(
            children: [
              Text(field.displayName.capitalize(), style: PlugItStyle.smallStyle),
              Expanded(
                  child: InputField(
                    hint: 'Enter ${field.type.capitalize()}',
                    onChanged: (value) {
                      widget.editedEvent!.fields[idx].value = value;
                    },
                    value: widget.editedEvent!.fields[idx].value,
                  )
              ),
            ],
          )
      );
    }
    return fields;
  }


  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: const BoxDecoration(
                color: Colors.transparent,
            ),
            child: Column(
              children: [
                Padding (
                  padding: const EdgeInsets.all(5),
                  child: Row(
                    children: [
                      const Text("2 - Edit Event", style: PlugItStyle.smallStyle),
                      IconButtonSwitch(
                          falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                          trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                          state: widget.isOpen,
                          onChange: (value) {
                            setState(() {
                              if (widget.isOpen) {
                                widget.onCardDeploy(false);
                              } else {
                                widget.onCardDeploy(true);
                              }
                            });
                          }
                      )
                    ],
                  ),
                ),
                SizedBox(height: (widget.isOpen) ? 10 : 0,),
                (widget.isOpen) ? const Divider(color: Colors.black) : const SizedBox(height: 0,),
                ...getActionFields(),
              ],
            )
        )
    );

  }
}
