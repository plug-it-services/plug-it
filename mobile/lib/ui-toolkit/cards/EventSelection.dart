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


class EventSelection extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function(bool state) onCardDeploy;
  final void Function(Event) onEventSelected;
  final void Function(Service) onServiceSelected;
  final PlugDetails plug;
  final Service? selectedService;
  final Event? selectedEvent;
  final PlugEvent? editedEvent;
  final List<Event>? events;



  const EventSelection({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.onEventSelected,
    required this.onServiceSelected,
    required this.plug,
    this.selectedService,
    this.selectedEvent,
    required this.editedEvent,
    required this.events,
  });

  @override
  State createState() => _StateEventSelection();
}
class _StateEventSelection extends State<EventSelection>{

  void onServiceSelected(value) {
    setState(() {
      widget.onServiceSelected(value);
    });
  }

  void onEventSelected(value) {
    setState(() {
      widget.onEventSelected(value);
      // editedEvent = PlugEvent.fromEventService(event: value, serviceName: selectedService!.name);
    });
  }




  @override
  void initState() {
    super.initState();
    if (widget.selectedService == null) {
      return;
    }

  }

  List<Widget> getServiceSelection() {

    List<Widget> fields = [];

    if (!widget.isOpen) {
      return fields;
    }
    fields.add(const SizedBox(height: 20,));
    fields.add(DropdownSearch<Service>(
        onChanged: onServiceSelected,
        items: widget.services,
        selectedItem: widget.selectedService,
        itemAsString: (service) {
          return service.name.capitalize();
        },
        dropdownDecoratorProps: const DropDownDecoratorProps(
            dropdownSearchDecoration: InputDecoration(
              hintText: "Select a service",
            )
        )
    ));

    fields.add(const SizedBox(height: 15,));
    fields.add(DropdownSearch<Event>(
        selectedItem: widget.selectedEvent,
        onChanged: onEventSelected,
        items: widget.events ?? [],
        itemAsString: (service) {
          return service.name.capitalize();
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
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: const BoxDecoration(
                color: Colors.transparent,
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Text("1 ${(widget.selectedEvent != null) ? "- ${widget.selectedEvent!.name.capitalize()}" : "- Select an Action "}", style: PlugItStyle.smallStyle),
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
                      },
                    )
                  ],
                ),
                const SizedBox(height: 10,),
                const Divider(color: Colors.black),
                ...getServiceSelection(),
              ],
            )
        )
    );

  }
}
