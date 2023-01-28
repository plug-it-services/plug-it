import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/Plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/field/Field.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/IconButtonSwitch.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/models/Event.dart';
import 'package:mobile/ui-toolkit/input/InputField.dart';


class ActionEditCard extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function() onCardDeploy;
  final PlugDetails plug;
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
  List<Event>? events;
  Event? selectedEvent;
  PlugEvent? editedEvent;
  bool deployed = false;
  bool editActionDeployed = false;
  bool editServiceActionDeployed = true;

  void onServiceSelected(value) {
    setState(() {
      selectedService = value;
      _getEvents();
    });
  }

  void onEventSelected(value) {
    setState(() {
      selectedEvent = value;
      editedEvent = PlugEvent.fromEventService(event: value, serviceName: selectedService!.name);
      widget.plug.actions[widget.actionIdx] = editedEvent!;
    });
  }


  void _setEvents(List<Event> events) {
    setState(() {
      this.events = events;
    });
  }

  void _getEvents() {
    if (selectedService == null) {
      return;
    }
    PlugApi.getServiceActions(selectedService!.name).then((events) =>
    {
      _setEvents(events ?? [])
    });
  }

  List<Widget> getActionFields() {
    List<Widget> fields = [];

    if (!editActionDeployed || selectedEvent == null) {
      return fields;
    }
    for (Field field in selectedEvent!.fields) {
      //TODO: get proper input field based on the type of the data
      fields.add(const SizedBox(height:10));
      int idx = selectedEvent!.fields.indexOf(field);
      fields.add(Row(
        children: [
          Text(field.displayName),
          const SizedBox(width: 5,),
          InputField(hint: 'Enter ${field.type}', onChanged: (value) {
            editedEvent!.fields[idx].value = value;
          }, value: editedEvent!.fields[idx].value),
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
        onChanged: onEventSelected,
        items: events ?? [],
        itemAsString: (service) {
          return service.name;
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
    editedEvent = widget.plug.actions[widget.actionIdx];
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
                Text("${widget.actionIdx + 2} --| Action ${(selectedService != null) ? "- ${selectedService!.name}" : ""}", style: PlugItStyle.subtitleStyle),
                IconButtonSwitch(
                    falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                    trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                    state: deployed,
                    onChange: (value) {
                      setState(() {
                        deployed = value;
                      });
                    }
                )
              ],
            )
                : Column(
              children: [
                Row(
                  children: [
                    Text("${widget.actionIdx + 2} --| Action ${(selectedService != null) ? "- ${selectedService!.name}" : ""}", style: PlugItStyle.subtitleStyle),
                    IconButtonSwitch(
                        falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                        trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                        state: deployed,
                        onChange: (value) {
                          setState(() {
                            deployed = value;
                          });
                        }
                    )
                  ],
                ),
                const Divider(color: Colors.black),
                Row(
                    children: [
                      Text("1 ${(selectedEvent != null) ? "- ${selectedEvent!.name}" : "- Select an Action "}", style: PlugItStyle.subtitleStyle),
                      IconButtonSwitch(
                          falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                          trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                          state: editServiceActionDeployed,
                          onChange: (value) {
                            setState(() {
                              editServiceActionDeployed = value;
                              editActionDeployed = !value;
                            });
                          },
                      )
                    ],
                  ),
                  const SizedBox(height: 10,),
                  const Divider(color: Colors.black),
                  ...getActionSelection(),
                  Row(
                    children: [
                      Text("2 - Edit Action", style: PlugItStyle.subtitleStyle),
                      IconButtonSwitch(
                          falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                          trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                          state: editActionDeployed,
                          onChange: (value) {
                            setState(() {
                              editServiceActionDeployed = !value;
                              editActionDeployed = value;
                            });
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
