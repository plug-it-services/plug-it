import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';

import 'package:mobile/models/Plug.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/IconButtonSwitch.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/models/Trigger.dart';


class TriggerEditCard extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function() onCardDeploy;
  final Plug plug;

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
  Trigger? selectedTrigger;
  bool deployed = false;

  void onServiceSelected(value) {
    setState(() => {
      selectedService = value
    });
  }

  void onTriggerSelected(value) {
    setState(() {
      selectedTrigger = value;
      widget.plug.trigger = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    selectedTrigger = widget.plug.trigger;
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
                Text("1 --| Trigger ${(selectedTrigger!.name != null) ? "- ${selectedTrigger!.name}" : ""}"),
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
                    Text("1 --| Trigger ${(selectedTrigger!.name != null) ? "- ${selectedTrigger!.name}" : ""}"),
                    IconButtonSwitch(
                        falseIcon: const Icon(Icons.keyboard_arrow_down_rounded),
                        trueIcon: const Icon(Icons.keyboard_arrow_up_rounded),
                        onChange: (value) {deployed = value;}
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
                DropdownSearch<Trigger>(
                  onChanged: onTriggerSelected,
                  items: selectedService!.triggers,
                  itemAsString: (service) {
                    return service.name!;
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
