import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/Event.dart';

import 'package:mobile/models/Plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/IconButtonSwitch.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';


class TriggerEditCard extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function() onCardDeploy;
  final PlugDetails plug;

  const TriggerEditCard({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.plug
  });

  @override
  State createState() => _StateTriggerEditCard();
}
class _StateTriggerEditCard extends State<TriggerEditCard>{
  Service? selectedService;
  Event? selectedTrigger;
  PlugEvent? editedTrigger;
  bool deployed = false;
  List<Event>? events;

  void onServiceSelected(Service? value) {
    setState(() {
      selectedService = value;
      _getEvents();
    });
  }

  void onTriggerSelected(Event? value) {
    setState(() {
      selectedTrigger = value;
      widget.plug.event = PlugEvent.fromEventService(
        event: value!,
        serviceName: selectedService!.name,
      );
    });
  }

  void _setEvents(List<Event> events) {
    setState(() {
      this.events = events;
    });
  }

  void _getEvents()
  {
    if (selectedService == null) {
      return;
    }
     PlugApi.getServiceEvents(selectedService!.name).then((events) => {
      _setEvents(events ?? [])
    });
  }

  @override
  Widget build(BuildContext context) {
    editedTrigger = widget.plug.event;
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
                Text("1 --| Trigger ${(editedTrigger != null) ? "- ${editedTrigger!.serviceName}" : ""}", style: PlugItStyle.subtitleStyle),
                IconButtonSwitch(
                  falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                  trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                  onChange: (value) {
                    setState(() => deployed = value);
                  },
                  state: deployed
                )
              ],
            )
                : Column(
              children: [
                Row(
                  children: [
                    Text("1 --| Trigger ${(editedTrigger != null) ? "- ${editedTrigger!.serviceName}" : ""}", style: PlugItStyle.subtitleStyle),
                    IconButtonSwitch(
                        falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                        trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                        onChange: (value) {
                          setState(() => deployed = value);
                        },
                        state: deployed
                    )
                  ],
                ),
                const SizedBox(height: 10,),
                const Divider(color: Colors.black),
                const SizedBox(height: 20,),
                DropdownSearch<Service>(
                  onChanged: onServiceSelected,
                  items: widget.services,
                  itemAsString: (service) {
                    return service.name;
                  },
                  dropdownDecoratorProps: const DropDownDecoratorProps(
                    dropdownSearchDecoration: InputDecoration(
                      hintText: "Select a service",
                    )
                  ),
                ),
                const SizedBox(height: 15,),
                DropdownSearch<Event>(
                  onChanged: onTriggerSelected,
                  items: events ?? [],
                  itemAsString: (service) {
                    return service.name;
                  },
                  dropdownDecoratorProps: const DropDownDecoratorProps(
                    dropdownSearchDecoration: InputDecoration(
                      hintText: "Select an event",
                    )
                  )
                )
              ],
            )
        )
    );

  }
}
