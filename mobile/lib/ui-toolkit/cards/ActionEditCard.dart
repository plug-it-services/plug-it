import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';

import 'package:mobile/models/Plug.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/models/Variable.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/IconButtonSwitch.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/models/Action.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';


class ActionEditCard extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function() onCardDeploy;
  final Plug plug;
  final int actionIdx;

  const ActionEditCard({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.plug,
    required this.actionIdx
  });

  @override
  State createState() => _StateActionEditCard();
}
class _StateActionEditCard extends State<ActionEditCard>{
  Service? selectedService;
  Event? selectedAction;
  bool deployed = false;
  bool editActionDeployed = false;
  bool editServiceActionDeployed = true;

  void onServiceSelected(value) {
    setState(() => {
      selectedService = value
    });
  }

  void onTriggerSelected(value) {
    setState(() {
      selectedAction = value;
      widget.plug.actions![widget.actionIdx] = value;
    });
  }

  List<Widget> getActionFields() {
    List<Widget> fields = [];

    if (!editActionDeployed || selectedAction == null) {
      return fields;
    }
    for (Field field in selectedAction!.fields!) {
      //TODO: get proper input field based on the type of the data
      fields.add(const SizedBox(height:10));
      fields.add(Row(
        children: [
          Text(field.name!),
          const SizedBox(width: 5,),
          InputField(hint: 'Enter ${field.type}'),
          //TODO insert properly a dropdown to select and insert a variable in the field
        ],
      ));
    }
    return fields;
  }

  List<Widget> getActionSelection() {

    List<Widget> fields = [];

    if (!editServiceActionDeployed) {
      return fields;
    }
    fields.add(const SizedBox(height: 20,));
    fields.add(DropdownSearch<Service>(
        onChanged: onServiceSelected,
        items: widget.services,
        itemAsString: (service) {
          return service.name;
        },
        dropdownDecoratorProps: const DropDownDecoratorProps(
            dropdownSearchDecoration: InputDecoration(
              hintText: "Select a service",
            )
        )
    ));

    fields.add(const SizedBox(height: 15,));
    fields.add(DropdownSearch<Event>(
        onChanged: onTriggerSelected,
        items: selectedService!.actions,
        itemAsString: (service) {
          return service.name!;
        },
        dropdownDecoratorProps: const DropDownDecoratorProps(
            dropdownSearchDecoration: InputDecoration(
              hintText: "Select an event",
            )
        )
    ));
    return fields;
  }

  @override
  Widget build(BuildContext context) {
    selectedAction = widget.plug.actions![widget.actionIdx];
    return Padding(
        padding: const EdgeInsets.all(10),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              //TODO: make a dominant color picker of the icon to color the container
                color: PlugItStyle.cardColor,
                borderRadius: BorderRadius.circular(8)
            ),
            child: !deployed
                ? Row(
              children: [
                Text("${widget.actionIdx} --| Action ${(selectedAction!.name != null) ? "- ${selectedAction!.name}" : ""}"),
                IconButtonSwitch(
                    falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                    trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                    onChange: (value) {deployed = value;}
                )
              ],
            )
                : Column(
              children: [
                Row(
                  children: [
                    Text("${widget.actionIdx} --| Action ${(selectedAction!.name != null) ? "- ${selectedAction!.name}" : ""}"),
                    IconButtonSwitch(
                        falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                        trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                        onChange: (value) {deployed = value;}
                    )
                  ],
                ),
                const Divider(color: Colors.black),
                Row(
                    children: [
                      Text("1 ${(selectedAction!.name != null) ? "- ${selectedAction!.name}" : "- Select an Action "}"),
                      IconButtonSwitch(
                          falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                          trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                          onChange: (value) {
                            editServiceActionDeployed = value;
                            editActionDeployed = !value;
                          },
                          state: true
                      )
                    ],
                  ),
                  const SizedBox(height: 10,),
                  const Divider(color: Colors.black),
                  ...getActionSelection(),
                  Row(
                    children: [
                      Text("2 - Edit Action"),
                      IconButtonSwitch(
                          falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                          trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                          onChange: (value) {
                            editServiceActionDeployed = !value;
                            editActionDeployed = value;
                          }
                      )
                    ],
                  ),
                const SizedBox(height: 10,),
                const Divider(color: Colors.black),
                ...getActionFields(),
              ],
            )
        )
    );

  }
}
