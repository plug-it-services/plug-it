import 'package:flutter/material.dart';
import 'package:mobile/models/plug/PlugDetails.dart';

import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/field/Field.dart';
import 'package:mobile/models/Event.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/cards/CardTitle.dart';
import 'package:mobile/ui-toolkit/input/string_input.dart';


class FieldsEditor extends StatefulWidget {
  final List<Service> services;
  final PlugDetails plug;
  final bool isOpen;
  final bool isTrigger;
  final void Function(bool ) onCardDeploy;
  final Event? selectedEvent;
  final PlugEvent editedEvent;

  const FieldsEditor({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.selectedEvent,
    required this.editedEvent,
    required this.plug,
    required this.isTrigger,
  });

  @override
  State createState() => _StateFieldsEditor();
}
class _StateFieldsEditor extends State<FieldsEditor>{


  List<Widget> getActionFields() {
    List<Widget> fields = [];

    if (!widget.isOpen || widget.selectedEvent == null) {
      return fields;
    }
    for (Field field in widget.selectedEvent!.fields) {
      //TODO: get proper input field based on the type of the data
      // TODO: string, number, date (js format)
      fields.add(const SizedBox(height: 5));
      int idx = widget.selectedEvent!.fields.indexOf(field);
      fields.add(StringInputField(
        editedField: widget.editedEvent.fields[idx],
        templateField: field,
        plug: widget.plug,
        hint: '',
        isTrigger: widget.isTrigger,
        event: widget.editedEvent,
      ));
    }
    return fields;
  }


  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
                color: (widget.isOpen) ? PlugItStyle.primaryColor : Colors.transparent,
                borderRadius: BorderRadius.circular(4),
            ),
            child: CardTitle(
              label: "2 - Edit Event",
              style: PlugItStyle.smallStyle,
              state: widget.isOpen,
              onPressed: () {
                setState(() {
                  if (widget.isOpen) {
                    widget.onCardDeploy(false);
                  } else {
                    widget.onCardDeploy(true);
                  }
                });
              },
              children: [
                SizedBox(height: (widget.isOpen) ? 10 : 0,),
                ...getActionFields(),
                SizedBox(height: (widget.isOpen) ? 10 : 0,),
              ]
            ),
        ),
    );

  }
}
