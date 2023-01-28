import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/types.dart';

part 'Field.g.dart';

@JsonSerializable()
class Field {
  String key, type, displayName;
  bool required;

  Field({required this.key, required this.type, required this.displayName, required this.required});

  factory Field.fromJson(Json json) => _$FieldFromJson(json);

  Json toJson() => _$FieldToJson(this);
}