import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/types.dart';

part 'Plug.g.dart';

@JsonSerializable()
class Plug {
  String id, name;
  List<String> icons;
  bool enabled;

  Plug(
      {required this.id,
      required this.name,
      required this.icons,
      required this.enabled});

  factory Plug.fromJson(Json json) => _$PlugFromJson(json);

  Json toJson() => _$PlugToJson(this);
}
